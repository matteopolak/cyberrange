## CyberRange

![Build Status](https://github.com/matteopolak/cyberrange/actions/workflows/check.yml/badge.svg)

An unofficial API wrapper for [CyberRange](https://ictc-cyberrange.fieldeffect.net).

### Features

- Includes wrapper for administrator API
- TypeScript support

### Requirements

- Node.js 16.0.0+

### Example usage

```typescript
import { User } from 'cyberrange';

// Create a new user
const user = new User('username', 'password');

// Authenticate the user
await user.login();

// Print out all active and expired campaigns (courses)
console.log(
	await user.campaigns(),
);
```
