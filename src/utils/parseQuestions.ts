export interface ParsedQuestion {
  text: string;
  options: string[];
}

export interface ParsedContent {
  cleanContent: string;
  questions: ParsedQuestion[];
}

/**
 * Parses AI response content to extract questions in the [QUESTION]...[/QUESTION] format
 * @param content - The raw AI response content
 * @returns Object with clean content (questions removed) and extracted questions array
 */
export function parseQuestions(content: string): ParsedContent {
  const questions: ParsedQuestion[] = [];
  
  // Regex to match [QUESTION]...[/QUESTION] blocks
  const questionRegex = /\[QUESTION\]([\s\S]*?)\[\/QUESTION\]/g;
  
  let cleanContent = content;
  let match;
  
  while ((match = questionRegex.exec(content)) !== null) {
    const questionBlock = match[1].trim();
    const lines = questionBlock.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length > 0) {
      // First non-option line is the question text
      const questionLines: string[] = [];
      const options: string[] = [];
      
      for (const line of lines) {
        if (line.startsWith('-')) {
          // This is an option
          options.push(line.substring(1).trim());
        } else if (options.length === 0) {
          // This is part of the question text (before options start)
          questionLines.push(line);
        }
      }
      
      const questionText = questionLines.join(' ').trim();
      
      if (questionText && options.length > 0) {
        questions.push({
          text: questionText,
          options,
        });
      }
    }
  }
  
  // Remove question blocks from content
  cleanContent = content.replace(questionRegex, '').trim();
  
  // Clean up extra whitespace/newlines left after removal
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim();
  
  return {
    cleanContent,
    questions,
  };
}

/**
 * Check if content contains any questions
 * @param content - The raw AI response content
 * @returns boolean indicating if questions are present
 */
export function hasQuestions(content: string): boolean {
  return /\[QUESTION\][\s\S]*?\[\/QUESTION\]/.test(content);
}
