const Contact = () => {
  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-400 mb-10">Have questions? Let’s talk.</p>

        <form className="space-y-6 text-left">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded bg-zinc-900 border border-gray-700 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded bg-zinc-900 border border-gray-700 focus:outline-none"
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full p-3 rounded bg-zinc-900 border border-gray-700 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded font-semibold hover:opacity-80"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
