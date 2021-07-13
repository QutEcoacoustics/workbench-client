# Override Bootstrap Styles

The purpose of these scss files is to override the default styles of bootstrap. In bootstrap 5, CSS variables are still not being properly utilised, and as such, we are unable to change the theming of the website in real time. To combat this, we have created a group of CSS variables which are pure CSS equivalents for the sass [theme color variables](https://getbootstrap.com/docs/5.0/utilities/colors/) created by bootstrap (ie. $primary, $secondary, etc). This solution is a temporary fix while we wait for native support to arrive, at the time of writing, this is tracked by the following issue: https://github.com/twbs/bootstrap/issues/26596.

## Folder Structure

Currently the folder structure attempts to follow the folder structure of bootstrap. If you are unsure where a new style should exist, view either the bootstrap [docs](https://getbootstrap.com/docs/5.0/getting-started/introduction/) or the [github repository](https://github.com/twbs/bootstrap/tree/v5.0.2). To simplify imports, we create an _index.scss file per folder, and import all styles inside the folder, into the file.

## Further Details

Issue which caused this change: https://github.com/QutEcoacoustics/workbench-client/issues/1184