import { Button } from '../components/ui/Button';
import { BookOpen, Sparkles, Wand2, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 relative">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm-10-8c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      {/* Additional paper grain */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f4e4bc' fill-opacity='0.3'%3E%3Cpath d='M0 0h200v200H0z'/%3E%3Cpath d='M0 0h200v1H0zM0 2h200v1H0zM0 4h200v1H0zM0 6h200v1H0zM0 8h200v1H0zM0 10h200v1H0zM0 12h200v1H0zM0 14h200v1H0zM0 16h200v1H0zM0 18h200v1H0zM0 20h200v1H0zM0 22h200v1H0zM0 24h200v1H0zM0 26h200v1H0zM0 28h200v1H0zM0 30h200v1H0zM0 32h200v1H0zM0 34h200v1H0zM0 36h200v1H0zM0 38h200v1H0zM0 40h200v1H0zM0 42h200v1H0zM0 44h200v1H0zM0 46h200v1H0zM0 48h200v1H0zM0 50h200v1H0zM0 52h200v1H0zM0 54h200v1H0zM0 56h200v1H0zM0 58h200v1H0zM0 60h200v1H0zM0 62h200v1H0zM0 64h200v1H0zM0 66h200v1H0zM0 68h200v1H0zM0 70h200v1H0zM0 72h200v1H0zM0 74h200v1H0zM0 76h200v1H0zM0 78h200v1H0zM0 80h200v1H0zM0 82h200v1H0zM0 84h200v1H0zM0 86h200v1H0zM0 88h200v1H0zM0 90h200v1H0zM0 92h200v1H0zM0 94h200v1H0zM0 96h200v1H0zM0 98h200v1H0zM0 100h200v1H0zM0 102h200v1H0zM0 104h200v1H0zM0 106h200v1H0zM0 108h200v1H0zM0 110h200v1H0zM0 112h200v1H0zM0 114h200v1H0zM0 116h200v1H0zM0 118h200v1H0zM0 120h200v1H0zM0 122h200v1H0zM0 124h200v1H0zM0 126h200v1H0zM0 128h200v1H0zM0 130h200v1H0zM0 132h200v1H0zM0 134h200v1H0zM0 136h200v1H0zM0 138h200v1H0zM0 140h200v1H0zM0 142h200v1H0zM0 144h200v1H0zM0 146h200v1H0zM0 148h200v1H0zM0 150h200v1H0zM0 152h200v1H0zM0 154h200v1H0zM0 156h200v1H0zM0 158h200v1H0zM0 160h200v1H0zM0 162h200v1H0zM0 164h200v1H0zM0 166h200v1H0zM0 168h200v1H0zM0 170h200v1H0zM0 172h200v1H0zM0 174h200v1H0zM0 176h200v1H0zM0 178h200v1H0zM0 180h200v1H0zM0 182h200v1H0zM0 184h200v1H0zM0 186h200v1H0zM0 188h200v1H0zM0 190h200v1H0zM0 192h200v1H0zM0 194h200v1H0zM0 196h200v1H0zM0 198h200v1H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      {/* Content */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary-200">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-100 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-primary-600">AI-Powered Story Creation</span>
            </div>

            <h1 className="mb-6 font-serif text-5xl tracking-tight text-gray-800 lg:text-7xl">
              Craft Stories with the Magic of AI
            </h1>

            <p className="mb-12 text-xl leading-relaxed text-gray-700 lg:text-2xl">
              Transform your ideas into captivating narratives. Simply provide a title, description, and genre. Then let our
              AI agents bring your stories to life.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                onClick={() => navigate('/dashboard')}
                size="lg" 
                className="gap-2 text-base bg-amber-800 hover:bg-amber-900 text-white"
              >
                Start Writing
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="secondary" 
                size="lg" 
                className="gap-2 text-base bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="border-b border-primary-200">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-gray-800 lg:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700">
              Our AI agents handle the creative heavy lifting, so you can focus on your vision
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="group space-y-4">
              <div className="inline-flex rounded-full bg-primary-100 p-4">
                <Wand2 className="h-6 w-6 text-primary-600 transition-colors group-hover:text-accent-600" />
              </div>
              <h3 className="font-serif text-2xl tracking-tight text-gray-800">Define Your Story</h3>
              <p className="leading-relaxed text-gray-700">
                Start with a title, brief description, and genre. Our intuitive interface makes it simple to set the
                foundation for your narrative.
              </p>
            </div>

            <div className="group space-y-4">
              <div className="inline-flex rounded-full bg-primary-100 p-4">
                <Sparkles className="h-6 w-6 text-primary-600 transition-colors group-hover:text-accent-600" />
              </div>
              <h3 className="font-serif text-2xl tracking-tight text-gray-800">AI Creates Characters</h3>
              <p className="leading-relaxed text-gray-700">
                Watch as our AI agents develop rich, compelling characters that fit perfectly into your story world with
                unique personalities and backgrounds.
              </p>
            </div>

            <div className="group space-y-4">
              <div className="inline-flex rounded-full bg-primary-100 p-4">
                <FileText className="h-6 w-6 text-primary-600 transition-colors group-hover:text-accent-600" />
              </div>
              <h3 className="font-serif text-2xl tracking-tight text-gray-800">Generate Chapters</h3>
              <p className="leading-relaxed text-gray-700">
                Our writing agents craft engaging chapters with proper pacing, dialogue, and narrative flow. Review and
                refine as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-primary-200">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="rounded-2xl border border-primary-200 bg-white p-12 text-center shadow-sm lg:p-16">
            <BookOpen className="mx-auto mb-6 h-12 w-12 text-amber-700" />
            <h2 className="mb-4 font-serif text-4xl tracking-tight text-gray-800 lg:text-5xl">
              Ready to Begin Your Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-700">
              Join writers who are using AI to unlock their creative potential and bring their stories to life.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')}
              size="lg" 
              className="gap-2 text-base bg-amber-800 hover:bg-amber-900 text-white"
            >
              Create Your First Story
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}
