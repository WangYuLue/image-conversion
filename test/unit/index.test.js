describe('canvastoDataURL', function () {
  it('load png image', async () => {
    const file = await urltoBlob('../images/demo.png');
    expect(file.type).to.be.equal('image/png');
  });
});