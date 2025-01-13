import * as vscode from 'vscode';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export class NoteWorkspace {
    static _rxFileExtensions = '\\.(md|markdown|mdx|fountain|txt)$';

    static newNoteContent(title: string, noteDirectory: string, useTemplate:boolean) {
        const path = join(noteDirectory, '_NoteTemplate.md');
        if(useTemplate){
            const fileContents = readFileSync(path).toString();
            return `# ${title}\n\n${fileContents}`;

        }
        return `# ${title}\n\n`;
    }

    static newNoteUsingTemplate(){
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

    static getWorkspaceDirectory() {
        let dir = '';
        if (vscode.workspace.workspaceFolders !== undefined) {
            dir = vscode.workspace.workspaceFolders[0].uri.path;
        }
        return dir;
    }

    static async createNewNoteFile(noteDirectory: string, useTemplate: boolean) {
   
        const d = (new Date().toISOString().match(/(\d{4}-\d{2}-\d{2})/) || '')[0]; // "2020-08-25"
        const filename = this.noteFileNameFromTitle(d);
        const filepath = join(noteDirectory, filename);

        const fileAlreadyExists = existsSync(filepath);
        if (!fileAlreadyExists) {
            // create the file if it does not exist
            const contents = this.newNoteContent(d, noteDirectory, useTemplate);
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