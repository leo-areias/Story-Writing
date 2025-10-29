import { type Character } from '../types';
import { Card } from './ui/Card';
import { getRoleColor, truncateText, cn } from '../utils';
import { Heart, Target, Users } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  className?: string;
}

export function CharacterCard({ character, className }: CharacterCardProps) {
  return (
    <Card className={cn('character-card', className)}>
      {/* Character Avatar & Name */}
      <div className="mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
          {character.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-lg font-semibold text-primary-900 text-center">
          {character.name}
        </h3>
        <div className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2',
          getRoleColor(character.role)
        )}>
          {character.role}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-primary-600 text-center mb-4 leading-relaxed">
        {truncateText(character.description, 120)}
      </p>

      {/* Personality */}
      {character.personality && (
        <div className="mb-4">
          <div className="flex items-center text-xs text-primary-500 mb-2">
            <Heart className="w-3 h-3 mr-1" />
            <span>Personality</span>
          </div>
          <p className="text-xs text-primary-700">
            {truncateText(character.personality, 80)}
          </p>
        </div>
      )}

      {/* Motivations */}
      {character.motivations && character.motivations.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-xs text-primary-500 mb-2">
            <Target className="w-3 h-3 mr-1" />
            <span>Motivations</span>
          </div>
          <div className="space-y-1">
            {character.motivations.slice(0, 2).map((motivation, index) => (
              <p key={index} className="text-xs text-primary-700">
                • {truncateText(motivation, 60)}
              </p>
            ))}
            {character.motivations.length > 2 && (
              <p className="text-xs text-primary-500">
                +{character.motivations.length - 2} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Relationships */}
      {character.relationships && character.relationships.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-xs text-primary-500 mb-2">
            <Users className="w-3 h-3 mr-1" />
            <span>Relationships</span>
          </div>
          <div className="space-y-1">
            {character.relationships.slice(0, 2).map((relationship, index) => (
              <div key={index} className="text-xs text-primary-700">
                <span className="font-medium">{relationship.characterId || 'Unknown'}</span>
                <span className="text-primary-500 ml-1">
                  ({relationship.relationshipType})
                </span>
              </div>
            ))}
            {character.relationships.length > 2 && (
              <p className="text-xs text-primary-500">
                +{character.relationships.length - 2} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Appearance */}
      {character.appearance && (
        <div className="text-xs text-primary-500 border-t border-primary-200 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Age:</span> {character.appearance.age}
            </div>
            <div>
              <span className="font-medium">Gender:</span> {character.appearance.gender}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
