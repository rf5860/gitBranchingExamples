# Branching

## Overview

A common branching model is git-flow. A simplified model proposes removing the develop branch.

Example of current model:

`<TODO: Add Image>`

Same commits, under the master-only model:

`<TODO: Add Image>`

A second proposal, is a new branch type, we label 'integration'. This is proposed regardless of using git-flow or the master-only.

It's purpose is to support long-lived feature branches. This is convenient for CI tasks, like Jenkins triggers based on branch.

`<TODO: Add Image with long-lived Branches>`

## Simplified Model - Master Only

The below shows the equivalent commands in a master-only model, and advantages in using this modification.

### Git Flow Commands

Standard [git-flow](http://nvie.com/posts/a-successful-git-branching-model/) has convenient tooling support. Here is list of equivalent commands:

#### Features

Replacements for feature commands (Run to add them to your global git config)

```sh
# Replacement for: `git flow feature start FEATURE`
git config --global alias.feature-start '!startFeature() { git checkout -b feature/$1 ${$2:-master}; }; startFeature '
# Replacement for: `git flow feature publish FEATURE`
git config --global alias.feature-publish '!publishFeature() { "git push -u origin feature/${1}:feature/$1" }; publishFeature '
# Example usage:
git feature-start A;               # Creates feature/A from master
git feature-start C integration/B; # Creates feature/C from integration/B
git feature-start D hotfix/1.1;    # Creates feature/D from hotfix/1.1
git feature-start E release/2.0;   # Creates feature/E from release/2.0
git feature-publish A;             # Pushes feature/A
```

#### Releases

Replacements for release commands (Run to add them to your global git config)

```sh
# Replacement for: `git flow release start VERSION`
git config --global alias.release-start '!startRelease() { git checkout release/$1 master; }; startRelease '
# Replacement for: `git flow release publish VERSION`
git config --global alias.release-publish '!publishRelease() { git push origin release/$1:release/$1; }; publishRelease '
# Replacement for: `git flow release finish VERSION`
git config --global alias.release-finish '!\
finishRelease() (
  set -e; # Exit on first error
  git checkout master; git pull;
  git merge --no-edit --no-ff release/$1;
  git branch -d release/$1;
  git push origin :release/$1;
); finishRelease '
# Example usage:
git release-start 2.0;   # Creates release/2.0
git release-publish 2.0; # Pushes release/2.0
git release-finish 2.0;  # Finishes release/2.0
```

#### Hotfixes

Replacements for hotfix commands (Run to add them to your global git config)

```sh
# Replacement for: `git flow hotfix start VERSION`
git config --global alias.hotfix-start '!startHotfix() { git checkout hotfix/$1 master; }; startHotfix '
# Replacement for: `git flow hotfix finish VERSION`
git config --global alias.hotfix-finish '!\
finishHotfix() (
  set -e;
  relBr="$(git branch -r --list "origin/release/*" | sed -e "sZ\s*origin/ZZ" | head -1)";
  mergeIn() { git checkout $1; git pull; git merge --no-edit --no-ff $2; };
  mergeIn master hotfix/$1;
  if [[ -n $relBr ]]; then mergeIn $relBr master; fi;
  git branch -d hotfix/$1;
  git push origin :hotfix/$1;
); finishHotfix '
# Example usage:
git hotfix-start 1.1;   # Creates hotfix/1.1
git hotfix-finish 1.1;  # Finishes hotfix/1.1
```

### JGitFlow

For java projects, [jgit-flow](https://bitbucket.org/atlassian/jgit-flow/src/develop/) if used, to help manage versioning in poms. This is the list of equivalent commands:

#### Releases (JGitFlow)

Add these functions to your `.bashrc` (for bash) or `.zshrc` (for zsh) to run this anywhere

```sh
# Replacement for: `mvn jgitflow:release-start VERSION`
function releaseStart() (
  set -e; # Exit on first error
  git checkout -b release/$1 master;
  mvn versions:set -DnewVersion=$1-SNAPSHOT -DgenerateBackupPoms=false;
  git commit -m "Updating poms for $1 SNAPSHOT development" -- "*pom.xml"
  git push -u origin release/$1
)
# Replacement for: `mvn jgitflow:release-finish VERSION`
function releaseFinish() (
  set -e; # Exit on first error
  git checkout release/$1; git pull;
  mvn versions:set -DnewVersion=$1 -DgenerateBackupPoms=false;
  git commit -m "Updating poms for branch 'release/$1' with non-snapshot versions" -- '*pom.xml'

  git checkout master; git pull;
  git merge release/$1 --no-ff;
  git push;
  git tag $1; git push --tags;

  git checkout master;
  mvn clean deploy;
  git branch -d release/8.14;
  git push origin :release/8.14;
)
# Example usage:
releaseStart 8.14
releaseFinish 8.14
```

#### Hotfixes (JGitFlow)

Add these functions to your `.bashrc` (for bash) or `.zshrc` (for zsh) to run this anywhere

```sh
# Replacement for: `mvn jgitflow:hotfix-start VERSION`
function hotfixStart() (
  set -e; # Exit on first error
  git checkout -b hotfix/$1 master;
  mvn versions:set -DnewVersion=$1-SNAPSHOT -DgenerateBackupPoms=false;
  git commit -m "Updating poms for $1 SNAPSHOT development" -- "*pom.xml";
  git push -u origin hotfix/$1;
)
# Replacement for: `mvn jgitflow:hotfix-finish VERSION`
hotfixFinish() (
  set -e; # Exit on first error
  git checkout hotfix/$1; git pull;
  mvn versions:set -DnewVersion=$1 -DgenerateBackupPoms=false;
  git commit -m "Updating poms for branch 'hotfix/$1' -- '*pom.xml";

  git checkout master; git pull;
  git merge hotfix/$1 --no-ff;
  git push;
  git tag $1; git push --tags;

  # Release Branch (If it exists)
  relBr="$(git branch -r --list "origin/release/*" | sed -e "sZ\s*origin/ZZ" | head -1)";
  if [[ -n "$relBr" ]]; then
    git checkout release/$1; git pull
    mvn versions:set -DnewVersion=$1 -DgenerateBackupPoms=false;
    git commit -m "Updating develop poms to latest version to avoid merge conflicts"  -- "*pom.xml";
    git merge master;
    mvn versions:set -DnewVersion=$relBr-SNAPSHOT -DgenerateBackupPoms=false;
    git commit -m "Updating poms back to pre-merge state" -- "*pom.xml";
    git push;
  fi;

  git checkout master;
  mvn clean deploy;
  git branch -d hotfix/$1;
  git push origin :hotfix/$1;
)
# Example usage:
hotfixStart 8.13.1
hotfixFinish 8.13.1
```

### Advantages

Several advantages exist in the master-only model (compared to git-flow). This is a list of those advantages, along with details on common issues experienced with the git-flow model.

- Merge Conflicts
- Pom versioning
- Merge Targets