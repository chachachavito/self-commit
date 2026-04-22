import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getStagedDiff, commit } from './git.js';
import { AIService } from './ai.js';

export async function main(options) {
  console.log(chalk.bold.cyan('\n🚀 self-commit: Copywriting Assistant\n'));

  const spinner = ora('Analyzing staged changes...').start();
  
  try {
    const diff = await getStagedDiff();
    spinner.text = 'Generating commit message...';
    
    const ai = new AIService();
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

    const { confirmed, finalMessage } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Do you want to use this message?',
        default: true
      },
      {
        type: 'editor',
        name: 'finalMessage',
        message: 'Edit the message:',
        default: suggestedMessage,
        when: (answers) => !answers.confirmed
      }
    ]);

    const messageToUse = confirmed ? suggestedMessage : finalMessage;

    if (messageToUse) {
      await commit(messageToUse);
      console.log(chalk.bold.green('\n✅ Commit successful!'));
    } else {
      console.log(chalk.red('\n✖ Commit cancelled.'));
    }

  } catch (error) {
    spinner.fail(error.message);
    throw error;
  }
}
