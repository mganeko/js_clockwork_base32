# js_clockwork_base32

JavaScript implementation of Clockwork Base32

- spec: https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8
- go implementation:  https://github.com/szktty/go-clockwork-base32

# usage

```js
  import { encode32, encode32str, decode32, decode32str } from 'js/base32.mjs';

  // Uint8Array --> base32 string
  const encode1 = encode32(new Uint8Array([1]));

  // base32 string --> Uint8Array
  const decode1 = decode32(ecoded1);

  // str --> base32 string
  const encode2 = encode32str('ABC');

  // base32 string --> str
  const decocd2 = decoded32str(encode2);
```

# License

MIT
