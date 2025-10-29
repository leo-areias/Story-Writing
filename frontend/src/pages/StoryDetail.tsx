import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function StoryDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container-calm section-padding">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            Story Detail Page
          </h1>
          <p className="text-primary-600 mb-6">
            Story ID: {id}
          </p>
          <p className="text-primary-500">
            This page will show detailed story information, characters, chapters, and AI progress.
          </p>
        </Card>
      </div>
    </div>
  );
}
