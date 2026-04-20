import { Brain, ShieldCheck, Zap } from "lucide-react";

const About = () => {
  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Built for the Future of AI
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            MyGPT is your all-in-one AI assistant designed to simplify tasks,
            boost productivity, and deliver intelligent conversations in real
            time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition">
            <Brain className="mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">
              Smart AI Conversations
            </h3>
            <p className="text-gray-400 text-sm">
              Experience real-time, human-like responses powered by advanced AI
              models.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition">
            <ShieldCheck className="mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-400 text-sm">
              Your conversations are protected with JWT authentication and
              secure storage.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition">
            <Zap className="mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Fast & Scalable</h3>
            <p className="text-gray-400 text-sm">
              Built with modern technologies to ensure lightning-fast
              performance.
            </p>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-20 text-center">
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Whether you're brainstorming ideas, generating content, or solving
            problems — MyGPT adapts to your workflow and enhances your
            productivity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
