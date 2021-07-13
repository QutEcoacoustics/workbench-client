# Override Bootstrap Styles

The purpose of these scss files is to override the default styles of bootstrap. In bootstrap 5, CSS variables are still not being properly utilised, and as such, we are unable to change the theming of the website in real time. To combat this, we have created a group of CSS variables which are pure CSS equivalents for the sass [theme color variables](https://getbootstrap.com/docs/5.0/utilities/colors/) created by bootstrap (ie. $primary, $secondary, etc). This solution is a temporary fix while we wait for native support to arrive, at the time of writing, this is tracked by the following issue: https://github.com/twbs/bootstrap/issues/26596.

## Folder Structure

Currently the folder structure attempts to follow the folder structure of bootstrap. If you are unsure where a new style should exist, view either the bootstrap [docs](https://getbootstrap.com/docs/5.0/getting-started/introduction/) or the [github repository](https://github.com/twbs/bootstrap/tree/v5.0.2). To simplify imports, we create an _index.scss file per folder, and import all styles inside the folder, into the file.

## Further Details

Issue which caused this change: https://github.com/QutEcoacoustics/workbench-client/issues/1184

## Interesting Notes

Our custom styles do not clear the bootstrap styles from the generated styles.css file. This means we rely on css specificity to make our styles take precedence, and the order at which imports withing the sass file are made is important. This results in the bootstrap file having the following definitions for example:

```css
// bootstrap styles
.btn-primary {
  color: #fff;
}
.btn-check:focus + .btn-primary,
.btn-primary:focus,
.btn-primary:hover {
  color: #fff;
  background-color: #0b5ed7;
  border-color: #0a58ca;
}
// ... more styles

// our overrides 
.btn-primary {
  color: hsl(0, 0%, calc((52.1568627451% - 49.8%) * -100));
  color: var(--baw-primary-contrast);
  background-color: #0d6efd;
  background-color: var(--baw-primary);
  border-color: #0d6efd;
  border-color: var(--baw-primary);
}
.btn-primary:hover {
  color: hsl(0, 0%, calc((calc(52.1568627451% - 10%) - 49.8%) * -100));
  color: var(--baw-primary-darker-contrast);
  background-color: hsl(215.75deg, 98.3606557377%, calc(52.1568627451% - 10%));
  background-color: var(--baw-primary-darker);
  border-color: hsl(215.75deg, 98.3606557377%, calc(52.1568627451% - 10%));
  border-color: var(--baw-primary-darker);
}
```

Also note that the initial values for the css variables are compiled into the styles output. This appears to be a feature of scss.