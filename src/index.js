import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getStagedDiff, commit } from './git.js';
import { AIService } from './ai.js';
import { getConfig } from './config.js';

export async function main(options) {
  const config = await getConfig();

  console.log(chalk.bold.cyan('\n🚀 self-commit: Copywriting Assistant\n'));

  const spinner = ora(`Analyzing staged changes (${config.provider})...`).start();

  try {
    const diff = await getStagedDiff();
    spinner.text = 'Generating commit message...';

    const ai = new AIService(config);
    const suggestedMessage = await ai.generateCommitMessage(diff);

    spinner.stop();

    console.log(chalk.green('Suggested message:'));
    console.log(chalk.gray('---'));
    console.log(suggestedMessage);
    console.log(chalk.gray('---\n'));

    if (options.dryRun) {
      console.log(chalk.yellow('Dry run: skipping commit.'));
      return;
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Commit with this message', value: 'commit' },
          { name: 'Edit message', value: 'edit' },
          { name: 'Regenerate', value: 'regenerate' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);

    if (action === 'cancel') {
      console.log(chalk.red('\n✖ Commit cancelled.'));
      return;
    }

    if (action === 'regenerate') {
      return main(options); // Recursive call for now
    }

    let messageToUse = suggestedMessage;

    if (action === 'edit') {
      const { editedMessage } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'editedMessage',
          message: 'Edit the message:',
          default: suggestedMessage,
        },
      ]);
      messageToUse = editedMessage;
    }

    if (messageToUse) {
      await commit(messageToUse);
      console.log(chalk.bold.green('\n✅ Commit successful!'));
    }
  } catch (error) {
    spinner.fail(error.message);
    throw error;
  }
}
