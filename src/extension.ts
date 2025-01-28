import * as vscode from 'vscode';
import { DailyNotes } from './DailyNotes';

export function activate(context: vscode.ExtensionContext) {
	// The commandId parameter must match the command field in package.json
	const newNoteDisposable = vscode.commands.registerCommand(
		'daily-notes.newDailyNote',
		DailyNotes.newNote
	);

	const newNoteWithTemplateDisposable = vscode.commands.registerCommand(
		'daily-notes.newNoteUsingTemplate',
		DailyNotes.newNoteUsingTemplate
	);

	const sortTwoLevelListDisposable = vscode.commands.registerCommand(
		'daily-notes.sortTwoLevelList',
		DailyNotes.sortTwoLevelList
	);

	const insertDateDisposable = vscode.commands.registerCommand(
		'daily-notes.insertDate',
		DailyNotes.insertDate
	);
	const insertTimeDisposable = vscode.commands.registerCommand(
		'daily-notes.insertTime',
		DailyNotes.insertTime
	);

	const insertDateTimeDisposable = vscode.commands.registerCommand(
		'daily-notes.insertDateTime',
		DailyNotes.insertDateTime
	);

	context.subscriptions.push(
		newNoteDisposable,
		newNoteWithTemplateDisposable,
		sortTwoLevelListDisposable,
		insertDateDisposable,
		insertTimeDisposable,
		insertDateTimeDisposable);

	vscode.commands.executeCommand('daily-notes.newNoteUsingTemplate');
}

export function deactivate() { }
