function download(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadPhoto(querySelector) {
  await htmlToImage
    .toPng(document.querySelector(querySelector))
    .then(function (dataUrl) {
      download(dataUrl, querySelector + ".png");
    });
}

// https://stackoverflow.com/questions/17710147/image-convert-to-base64
async function fileToDataUrl(file) {
  if (!file) return;
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
    reader.readAsDataURL(file);
  });
}

function populateTemplate({
  background,
  overlay,
  text,
  fontSize,
  previewBg,
  css,
}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NationWear Shirt Generator</title>
    <script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js"></script>
    <style>
      html, body {
        height: 100%;
      }

      body {
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: ${previewBg};
        color: #eee;
      }

      .container {
        position: relative;
        filter: url("#black-filter");
        container-type: inline-size;
      }

      .mask {
        mask-image: url("./assets/worn.jpg");
        mask-mode: luminance;
        mask-size: cover;
        mask-position: center;
        mask-repeat: no-repeat;
      }

      .absolute-fill {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .flag {
        ${background ? `background-image: url(${background});` : ""}
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: cover;
        /* background-size: 100%; */
      }

      .country-overlay {
        ${overlay ? `mask-image: url(${overlay});` : ""}
        mask-position: 50% 50%;
        mask-size: contain;
        mask-repeat: no-repeat;
      }

      .text {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: ${fontSize}cqw;
        font-weight: normal;
        font-family: Impact, sans-serif;
        line-height: 0.79;
        text-align: center;
        text-transform: uppercase;
        text-wrap: balance;
      }

      ${css ? css : ""}
    </style>
  </head>
  <body>
    <div class="shirt">
      <svg width="0" height="0" style="display: none">
        <!-- https://expensive.toys/blog/black-pixel-masking -->
        <!-- https://www.stefanjudis.com/blog/fancy-svg-filters/ -->
        <filter id="black-filter" color-interpolation-filters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -255 -255 -255 0 1"
            result="black-pixels"
          ></feColorMatrix>
          <feMorphology
            in="black-pixels"
            operator="dilate"
            radius="0.5"
            result="smoothed"
          ></feMorphology>
          <feComposite
            in="SourceGraphic"
            in2="smoothed"
            operator="out"
          ></feComposite>
        </filter>
      </svg>

      <div class="container mask">
        <!-- invisible image sets aspect ratio for flag bg -->
        <img src="${background}" style="width: 100%; opacity: 0" />
        <!-- text unmasked by country map, goes "behind" it -->
        <!-- flag background masked by country map -->
        <div class="flag country-overlay absolute-fill"></div>
        <!-- pure plack text masked by country map, which is made transparent -->
        <h2 class="text absolute-fill flag" style="background-clip: text; color: transparent">${text}</h2>
        <h2 class="text country-overlay absolute-fill" style="color: black">${text}</h2>
      </div>
    </div>
  </body>
</html>
`;
}
