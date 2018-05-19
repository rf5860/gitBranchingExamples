# Branching

## Overview

Our current model is Git Flow. The proposal is a modification, removing the develop branch.

Example of current model:

`<IMAGE>`

Same commits, under the proposed model:

`<IMAGE>`

Separate to this, we need to a new branch. This is regardless of if we change models. This is to allow us to trigger builds from Jenkins.

`<IMAGE (NEW WITH BRANCH)>`

## Proposed Model - Master Only

One of the big advantages for Git Flow, is the tooling support. The below shows the equivalent commands under the new model, and the advantages motivating this change.

### Git Flow Command

The current model - [Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/) - has tooling support that is convenient. Here is list of equivalent commands.

|             Git Flow Command             | Commands Run | New Branch Commands | Commands |
| ---------------------------------------- | ------------ | ------------------- |
| git flow init                            |   git init<br>git commit --allow-empty -m "Initial commit"<br>git checkout -b develop master           | git init<br>git commit --allow-empty -m "Initial commit"<br>git checkout -b develop master | Only needs to be run once on new repositories | 
| git flow feature start MYFEATURE         | git checkout -b feature/MYFEATURE develop             | git checkout -b feature/MYFEATURE develop                    |git checkout -b feature/MYFEATURE [master|release|integration|hotfix] | You can use the following alias for convenience<br>`git config --global alias.flow-feature "!flowFeature() { git checkout -b feature/$1 ${$2:-master}; }; flowFeature"`<br>Usage: `git flow-feature ENAB-1` 
| git flow feature publish MYFEATURE       | git checkout feature/MYFEATURE<br>git push origin feature/MYFEATURE             | git checkout feature/MYFEATURE<br>git push origin feature/MYFEATURE                    |
| git flow feature finish MYFEATURE        | git checkout develop<br>git merge --no-ff feature/MYFEATURE<br>git branch -d feature/MYFEATURE             | N/A (Code is only pulled after review, via BitBucket)                    |
| git flow feature pull origin MYFEATURE   |              |                     |
| git flow release start RELEASE [BASE]    |              |                     |
| git flow release publish RELEASE         |              |                     |
| git flow release track RELEASE           |              |                     |
| git flow release finish RELEASE          |              |                     |
| git flow hotfix start VERSION [BASENAME] |              |                     |
| git flow hotfix finish VERSION           |              |                     |

### JGitFlow

In addition to regular Git Flow, we use [jgit-flow](https://bitbucket.org/atlassian/jgit-flow/src/develop/) in our Java projects to manage versioning. This is the list of equivalent commands under the new model.

|         JGit Flow Command          | Commands Run | Proposed Equivalents |
| ---------------------------------- | ------------ | -------------------- |
| mvn:jgitflow release start VERSION |              |                      |
| mvn:jgitflow release start         |              |                      |
| mvn:jgitflow hotfix start  VERSION |              |                      |
| mvn:jgitflow hotfix finish         |              |                      |


### advantages

There are several advantages to the proposed model (compared to the current). This is a list of those advantages, along with details on common issues experienced with the current model.

- Merge Conflicts
- Pom versioning
- Merge Targets