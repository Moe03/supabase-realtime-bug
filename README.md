### Install bun please im done with esm/commonjs dumb erros:

Use pnpm to install..
```
pnpm install
```

Linux/MacOS
https://bun.sh/docs/installation

Linux/MacOS
```
curl -fsSL https://bun.sh/install | bash     # for macOS, Linux, and WSL
```

# to install a specific version
```
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.0"
```


Windows
To install, paste this into a terminal:
```
powershell -c "irm bun.sh/install.ps1|iex"
```

Once done make sure to run 
```
npx prisma generate 
```

then
```
npx prisma migrate dev --name init
```

then (just in case it didnt run automatically) 
```
bun run postinstall 
```

then to run dev server:
```
bun run dev
```

then go to localhost:3000/test to test the realtime functionality, on my end it shows:
```
created new user, should be in realtime ?
New Payload:  {
  schema: 'public',
  table: 'User',
  commit_timestamp: null,
  eventType: 'INSERT',
  new: {},
  old: {},
  errors: [ 'Error 401: Unauthorized' ]
}
```








