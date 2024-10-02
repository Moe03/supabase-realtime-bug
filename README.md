Install bun please im done with esm/commonjs dumb erros:


Linux/MacOS
https://bun.sh/docs/installation

curl -fsSL https://bun.sh/install | bash     # for macOS, Linux, and WSL
# to install a specific version
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.0"


Windows
To install, paste this into a terminal:
powershell -c "irm bun.sh/install.ps1|iex"

Once done make sure to run 
npx prisma generate 

then
npx prisma migrate dev --name init

then (just in case it didnt run automatically) 
bun run postinstall 

bun run dev







