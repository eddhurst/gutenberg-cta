# Gutenberg Call To Action block

This block heavily borrows and extends functionality from the core/cover component, to allow us to first upload an image, and then specifies a set template (heading, paragraph, button) to give more control over the content than just the single line of text available in the Cover component.

Additionally - I have included some styles to set the background as fixed, to give a "parallax" style effect.

Please feel free to take this and extend it as per your requirements.

---

# Extending

All of the block-specific files are available in `/src/block/*`

---

This project utilises Gutenberg, the latest WordPress editor soon to be packaged as part of WordPress.

It is in active development, please be aware that any updates may break functionality as things get added, moved or removed from the project.

---

This project was bootstrapped with [Create Guten Block](https://github.com/ahmadawais/create-guten-block).

Below you will find some information on how to run scripts.

>You can find the most recent version of this guide [here](https://github.com/ahmadawais/create-guten-block).

👉  `npm start`
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

👉  `npm run build`
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.

---

###### Big thanks to [@MrAhmadAwais](https://twitter.com/mrahmadawais/) for creating the [Create Guten Block] resource.
