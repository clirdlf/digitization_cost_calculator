A tool based on donated statistics that helps organizations better estimate the time and other costs related to digitization projects.

## Installation


## Quickstart

### Windows

Windows requires a few additional requirements that you will need to install:

* [Atom](https://atom.io/) - A much nicer text editor than Notepad...
* [git](https://git-scm.com/downloads) - We need this for the git-bash client
* [node](https://nodejs.org/en/) - For running a local web server
* [RailsInstaller](http://railsinstaller.org/) - For generating the JavaScript dataset
* [GitHubDesktop](https://desktop.github.com/) - For version control/publishing the website
* [GitHub Account](https://github.com) - An account on GitHub

After installation of these, you'll need to "clone" the repository. You can do so by clicking on the green "Clone or Download" button on the [project page](https://github.com/clirdlf/digitization_cost_calculator).

It doesn't matter where you save it, but you'll need to remember where it is. I always set my project location to `C:/Users/%user%/projects/`. Again, just remember where you save it to.

Make sure the branch says `gh-pages`.

In the GitHub Client, right click on the `digitization_cost_calculator` project and select "Open in Terminal".

In this terminal session, type:

```
npm install
bundle
```

After this is finished installing everything, in the terminal type `gulp`. This will start a webserver on you machine and open your browser to the page [http://localhost:3000](http://localhost:3000). Whenever you save a file, this will rebuild the site and refresh you page so you should see your update immediately.

To **stop** the webserver, hit `ctrl + c`.

#### Edit the Files

In the GitHub Client, right-click on the `digitization_cost_calculator` project and select **Open in Atom**. This should launch in Atom.

#### Publishing Changes

After you've made changes, you should see a list of changes under the "Uncommitted Change" tab at the top of the GitHub Client. Add a **Summary** of the changes you made a brief **description** of what changed. Then click on the **Commit to gh-pages** button to publish the change.

This is important, you then need to **sync** these changes by clicking on the **Sync** button in the top-right.

### OS X

All of the commands are run through the terminal. You can make this a
nicer experience with [iTerm2](https://www.iterm2.com/) and
[bash-it](https://github.com/Bash-it/bash-it#install).

1. Make a projects directory (`mkdir -p ~/projects`)
2. Clone the repository to your computer (`cd ~/projects && git clone https://github.com/clirdlf/digitization_cost_calculator.git`)
3. Change to the project directory (`cd ~/projects/digitization_cost_calculator`)
4. Install the dependencies (`bundle && npm install`)
5. Start the Jekyll server (`gulp`)
5. Open the project in your browser at [http://localhost:3000](http://localhost:3000) (it should open automatically though)
6. Celebrate :tada:

### Get Updates

1. Make sure you're on the master branch (`git checkout master`)
2. Pull from origin: (`git pull master origin`)

### Deploying

1. Commit your changes
2. Merge to the master branch (e.g. `git checkout master && git merge
   branch`)
3. Push to github (`git push origin master`)
4. Verify your update works at
   https://clirdlf.github.io/digitization_cost_calculator

## Dependencies

* [git](https://git-scm.com/)
* [Github Account](https://www.github.com/)
* [Jekyll](https://jekyllrb.com)
* [npm](https://www.npmjs.com/)
* [Ruby](https://www.ruby-lang.org/en/): Installed by default on OS X;
  for Windows users, use the [Rails Installer](http://railsinstaller.org/en)

## Contributing

1. [Create an issue][issues] to discuss your idea.
2. [Fork it][fork-it]
3. Create a feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Added my awesome feature'`)
5. Push the branch (`git push my-new-feature`)
6. Create a Pull Request
7. Profit! :white_check_mark:

## License

The Digitization Cost Calculator is licensed under the terms of the [Apache 2 license](LICENSE).

## Links

* [DLF](https://diglib.org)
* [Issue Tracker][issues]
* [Source code](https://github.com/clirdlf/digitization_cost_calculator)

[issues]: https://github.com/clirdlf/digitization_cost_calculator/issues
[fork-it]: https://github.com/clirdlf/digitization_cost_calculator/fork
