/* Canvas Donwload */
function download(data, filename) {
  /// create an "off-screen" anchor tag
  var lnk = document.createElement("a"),
    e;

  /// the key here is to set the download attribute of the a tag
  lnk.download = filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = data.toDataURL ? data.toDataURL("image/png;base64") : data;

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );

    lnk.dispatchEvent(e);
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }
}

const svgToPng = (svgDataurl, width, height) =>
  new Promise((resolve, reject) => {
    let canvas;
    let ctx;
    let img;

    img = new Image();
    img.src = svgDataurl;
    img.onload = () => {
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");
      console.log(img["width"], img["height"]);
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

      img = new Image();
      img.src = resolve(canvas.toDataURL("image/png"));
      // img.onload = () => {
      //     canvas = document.createElement('canvas');
      //     canvas.width = width;
      //     canvas.height = height;
      //     ctx = canvas.getContext('2d');
      //     ctx.drawImage(img, 0, 0);
      //     resolve(canvas.toDataURL('image/png'));
      // }
    };
  });

export { download, svgToPng };
