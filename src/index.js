import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import boxen from 'boxen';
import { getStagedData, commit } from './git.js';
import { AIService } from './ai.js';
import { getConfig } from './config.js';
import { getExternalContext } from './analyzer.js';

export async function main(options) {
  const { config, configPath } = await getConfig();

  // Show banner
  console.log(
    chalk.cyan(
      figlet.textSync('self-commit', {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );

  if (configPath) {
    console.log(chalk.yellow(`\n⚠️  Using local configuration: ${configPath}`));
  }

  const spinner = ora('Analyzing changes...').start();

  try {
    const { diff, fileList } = await getStagedData();

    let externalContext = null;
    if (options.context && config.contextCommand) {
      if (configPath) {
        console.log(
          chalk.yellow(
            `\n⚠️  SECURITY WARNING: Executing external command from local config: ${chalk.bold(
              config.contextCommand
            )}`
          )
        );
      }
      spinner.text = chalk.dim('Running architectural analysis...');
      externalContext = await getExternalContext(config.contextCommand);
    }

    spinner.text = chalk.dim('Generating commit message...');

    const ai = new AIService(config);
    const suggestedMessage = await ai.generateCommitMessage(diff, fileList, externalContext);

    spinner.stop();

    console.log(chalk.bold.magenta('PROPOSED MESSAGE:'));
    console.log(
      boxen(chalk.green(suggestedMessage), {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green',
        dimBorder: true,
      })
    );

    if (options.dryRun) {
      console.log(chalk.yellow('\nℹ Dry run: skipping commit.\n'));
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
