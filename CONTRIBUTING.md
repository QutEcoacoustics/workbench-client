# Contributing to workbench-client

## Best Practices

- Set the git `autocrlf` config setting. See
  <https://help.github.com/articles/dealing-with-line-endings/#global-settings-for-line-endings> for instructions.
- Avoid adding binary content to this repository. If it must be added, ensure git-lfs is tracking it.
- NEVER commit if the code does not build to the `master` branch
- Try to work on branches if your code negatively affects production code
- Write code in American English. Documentation may be written in Australian English.
- Wherever possible **use un-prefixed SI units for variables**

  - Variables with no unit **MUST** be standard units

    - `var duration = 30` should **always** be 30 seconds
    - `var bandwidth = 50` should **always be hertz**

  - **Never** use imperial units
  - **Always** include the full unit in the name if it does not follow our standard

    - avoid this if possible, see first point
    - e.g. `var minKiloHertz = 3.5`
    - e.g. `var limitHours = 6`

  - **Do not** abbreviate units
  - It is **recommended** that full units be used in any user facing field name

    - e.g. `EventEndSeconds` in a CSV file

## Binary Large Objects (BLOBs)

We use [git-lfs](https://git-lfs.github.com/) to store BLOBs for images. If you want to work on the website you need to have git-fls installed.

## Third party contributions

Third party contributions should be made by:

- forking the repository
- making changes in a branch
- submitting a pull-request to merge those changes from your-fork and branch, to our copy and master branch

## DOs and DON'Ts

Please do:

- **DO** follow our style (enforced by tslint)
- **DO** give priority to the current style of the project or file you're changing even if it diverges from the general
  guidelines.
- **DO** include tests when adding new features. When fixing bugs, start with adding a test that highlights how the
  current behavior is broken.
- **DO** keep the discussions focused. When a new or related topic comes up
  it's often better to create new issue than to side track the discussion.
- **DO** blog and tweet (or whatever) about your contributions, frequently!

Please do not:

- **DON'T** make PRs for style changes.
- **DON'T** surprise us with big pull requests. Instead, file an issue and start
  a discussion so we can agree on a direction before you invest a large amount
  of time.
- **DON'T** commit code that you didn't write. If you find code that you think is a good fit, file an issue and start a
  discussion before proceeding.
- **DON'T** submit PRs that alter licensing related files.

## Commit Messages

Please format commit messages as follows (based on [A Note About Git Commit Messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)):

```
Summarize change in 50 characters or less

Provide more detail after the first line. Leave one blank line below the
summary and wrap all lines at 72 characters or less.

If the change fixes an issue, leave another blank line after the final
paragraph and indicate which issue is fixed in the specific format
below.

Fix #42
```

Also do your best to factor commits appropriately, not too large with unrelated things in the same commit, and not too
small with the same small change applied N times in N different commits.
