import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function StoryReader() {
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
            Back to Story
          </Button>
        </div>

        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            Story Reader
          </h1>
          <p className="text-primary-600 mb-6">
            Story ID: {id}
          </p>
          <p className="text-primary-500">
            This page will display the interactive story reader with branching choices.
          </p>
        </Card>
      </div>
    </div>
  );
}
