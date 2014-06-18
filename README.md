Network Operations Center
=========================

Currently only the OS Tester is implemented.

To test all labs do the following:

```
git clone https://github.com/reillysiemens/noc.git
cd noc
npm install
node lib/ostest.js labs/all
```

Acknowledgements
================

This project borrows heavily from [baalexander](https://github.com/baalexander)'s [node-portscanner](https://github.com/baalexander/node-portscanner).
See `LICENSE.node-portscanner` for more details.
