const LivePreview = ({ htmlContent }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Live Preview:</h2>
      <div className="border p-6 shadow-lg rounded-lg resume-preview">
        <div
          className="resume-template m-8 font-serif text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </>
  );
};

export default LivePreview;
