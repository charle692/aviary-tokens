# How to contribute

If you are wanting to contribute to this repository, ensure to follow the guidelines here!

## Restricted development

All work done in this repository is intended to only be members of the Phoenix team, as this is a critical part of our design system infrastructure. We welcome any [requests for changes or features](https://github.com/Fullscript/aviary-tokens/blob/.github/CONTRIBUTING.md#requesting-updates) or [bug reports](https://github.com/Fullscript/aviary-tokens/blob/.github/CONTRIBUTING.md#bugs).

## Bugs

### Where to find known issues

We track all of our issues for Design Tokens in GitHub and [bugs](https://github.com/Fullscript/aviary-tokens/labels/Bug) are labeled accordingly.

### Reporting new issues

To ensure you are not double reporting, look through open issues before filing one. When [opening an issue](https://github.com/Fullscript/aviary-tokens/issues/new?template=ISSUE.md), complete as much of the template as possible. Then make sure to post the link to the bug in the #aviary-help channel in Slack!

## Requesting updates

To request feature updates or changes to the Design Tokens, pipe up in the #aviary-help channel with your request, and we'll get back to you there!

## Semantic versioning

Our design token repository follows semantic versioning for our release tagging. We release [patch versions for bug fixes](https://github.com/Fullscript/aviary-tokens/blob/.github/CONTRIBUTING.md#patch), [minor versions for new features](https://github.com/Fullscript/aviary-tokens/blob/.github/CONTRIBUTING.md#minor), and [major versions for breaking changes](https://github.com/Fullscript/aviary-tokens/blob/.github/CONTRIBUTING.md#major). When we make breaking changes, we introduce deprecation warnings in a minor version along with the upgrade path so that our users learn about the upcoming changes and migrate their code in advance.

The following sections detail what kinds of changes result in each of major, minor, and patch version bumps:

### Major

- Removal of a token (breaking change)
- Addition of totally new token type not previously added

### Minor

- New token being added to an existing token type
- A token value being changed
- New platform supported

### Patch

- Anything process related within the repository
