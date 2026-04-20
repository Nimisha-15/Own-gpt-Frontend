import { MessageCircle, HelpCircle, Mail } from "lucide-react";

const Support = () => {
  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Support</h2>
        <p className="text-gray-400 mb-12">We're here to help you anytime.</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition">
            <MessageCircle size={30} className="mb-4" />
            <h3 className="font-semibold text-lg">Live Chat</h3>
            <p className="text-gray-400 text-sm mt-2">
              Chat with our support team instantly.
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition">
            <HelpCircle size={30} className="mb-4" />
            <h3 className="font-semibold text-lg">Help Center</h3>
            <p className="text-gray-400 text-sm mt-2">
              Browse FAQs and guides.
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition">
            <Mail size={30} className="mb-4" />
            <h3 className="font-semibold text-lg">Email Support</h3>
            <p className="text-gray-400 text-sm mt-2">
              Reach us anytime via email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
