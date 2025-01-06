import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { isToday, format } from 'date-fns';
import { Button } from '../ui/button';
import OpenAI from 'openai';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Code,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  className?: string;
  currentDate: Date;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const enhanceText = async () => {
    const selectedText = editor.state.selection.content().content?.[0]?.content?.[0]?.text;
    if (!selectedText) {
      alert('Please select some text to enhance');
      return;
    }

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a helpful writing assistant. Enhance the given text to make it more engaging and professional while keeping the same meaning." 
          },
          { 
            role: "user", 
            content: `Enhance this text: "${selectedText}"` 
          }
        ],
        model: "gpt-3.5-turbo",
      });

      const enhancedText = completion.choices[0].message.content;
      if (enhancedText) {
        editor
          .chain()
          .focus()
          .setTextSelection(editor.state.selection)
          .insertContent(enhancedText.replace(/^"(.+)"$/, '$1'))
          .run();
      }
    } catch (error) {
      console.error('Error enhancing text:', error);
      alert('Error enhancing text. Please check your API key and try again.');
    }
  };

  return (
    <div className="editor-toolbar">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-gray-200' : ''}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={enhanceText}
        title="Enhance selected text with AI"
      >
        <Wand2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Editor = ({ content, onContentChange, currentDate, className }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: isToday(currentDate)
          ? 'Write about your day...'
          : `This entry is from ${format(currentDate, 'MMMM d, yyyy')}`,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <div className="editor-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
