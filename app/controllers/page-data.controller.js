export function loadPage1Data(req, res) {
  setTimeout(() => {
    res.send({
      data: {
        pageNumber: 1,
      },
    });
  }, 1000);
}
