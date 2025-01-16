import * as vscode from 'vscode';
import { existsSync } from 'node:fs';
import { join } from 'path';


export class NoteWorkspace {
    static _rxFileExtensions = '\\.(md|markdown|mdx|fountain|txt)$';

    static newNoteUsingTemplate() {
        NoteWorkspace.newNote(true);
    }

    static async newNote(useTemplate: boolean = false) {
        const noteDirectory = NoteWorkspace.getWorkspaceDirectory();


        const { filepath, fileAlreadyExists } = await NoteWorkspace.createNewNoteFile(noteDirectory, useTemplate);
        // open the file:
        vscode.window
            .showTextDocument(vscode.Uri.file(filepath), {
                preserveFocus: false,
                preview: false,
            })
            .then(() => {
                // if we created a new file, place the selection at the end of the last line of the template
                if (!fileAlreadyExists) {
                    let editor = vscode.window.activeTextEditor;
                    if (editor) {
                        const lineNumber = editor.document.lineCount;
                        const range = editor.document.lineAt(lineNumber - 1).range;
                        editor.selection = new vscode.Selection(range.end, range.end);
                        editor.revealRange(range);
                    }
                }
            });
    }

    static sortTwoLevelList() {
        const editor = vscode.window.activeTextEditor;
    
        if (!editor) {
          // Abort: no active editor;
          return;
        }
        const { selection } = editor;
        const text = editor.document.getText(selection);
        const selectionRange = new vscode.Range(selection.start, selection.end);
    
        if (text === '') {
          vscode.window.showErrorMessage('Error creating note from selection: selection is empty.');
          return;
        }

        let sortedList = NoteWorkspace.sortList(text);

        // Replace the selected content in the origin file with a wiki-link to the new file
        const edit = new vscode.WorkspaceEdit();


        edit.replace(
          editor.document.uri,
          selectionRange,
          sortedList
        );

        vscode.workspace.applyEdit(edit);
    } 
    
    static sortList(text: string): string {
        const regex = /^-.+\n(\s+-.+\n*)*/gm;

        // Make sure selection contains only a list
        let foundIndex = text.search(regex);
        let textArray = text.match(regex);
    
        if (foundIndex === 0 && textArray) {
            let trimmed = textArray.map(element => element.trim()).sort();
            return trimmed.join("\n");
        }
    
        console.log("No match found, only select a list");
        return text;
    }

    static getWorkspaceDirectory() {
        let dir = '';
        if (vscode.workspace.workspaceFolders !== undefined) {
            dir = vscode.workspace.workspaceFolders[0].uri.path;
        }
        return dir;
    }

    static async newNoteContent(title: string, noteDirectory: string, useTemplate: boolean) {
        const path = join(noteDirectory, '_NoteTemplate.md');

        if (useTemplate) {

            const uri = vscode.Uri.file(path);
            try {
                const fileContent = await vscode.workspace.fs.readFile(uri);
                const fileContentString = Buffer.from(fileContent).toString('utf8');
                return `# ${title}\n\n${fileContentString}`;
            } catch (error) {
                vscode.window.showErrorMessage(`Error reading file: ${error}`);
            }

            return `# ${title}\n\n`;
        }
    }

    static async createNewNoteFile(noteDirectory: string, useTemplate: boolean) {

        const d = (new Date().toISOString().match(/(\d{4}-\d{2}-\d{2})/) || '')[0]; // "2020-08-25"
        const filename = this.noteFileNameFromTitle(d);
        const filepath = join(noteDirectory, filename);

        const fileAlreadyExists = existsSync(filepath);
        if (!fileAlreadyExists) {
            // create the file if it does not exist
            const contents = await this.newNoteContent(d, noteDirectory, useTemplate);
            const edit = new vscode.WorkspaceEdit();
            const fileUri = vscode.Uri.file(filepath.toString());
            edit.createFile(fileUri);
            await vscode.workspace.applyEdit(edit);
            await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(contents));
        }

        return {
            filepath: filepath,
            fileAlreadyExists: fileAlreadyExists,
        };
    }


    static noteFileNameFromTitle(title: string): string {
        let t = this.slugifyClassic(title);
        return t.match(this.rxFileExtensions()) ? t : `${t}.md`;
    }

    static slugifyClassic(title: string): string {
        let t = title.replace(/[!"\#$%&'()*+,\-./:;<=>?@\[\\\]^_‘{|}~\s]+/gi, '-'); // punctuation and whitespace to hyphens (or underscores)
        return this.cleanTitle(t);
    }
    static cleanTitle(title: string): string {
        const caseAdjustedTitle = title.toLowerCase();
        // removing trailing slug chars
        return caseAdjustedTitle.replace(/[-_－＿ ]*$/g, '');
    }

    static rxFileExtensions(): RegExp {
        return new RegExp(this._rxFileExtensions, 'i');
    }

}