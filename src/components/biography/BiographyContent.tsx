import React from 'react';
import Image from 'next/image';
import { BiographyContent as BiographyContentType, ImageData } from '@/types';

interface BiographyContentProps {
  content: BiographyContentType;
  images: ImageData[];
  className?: string;
}

const BiographyContent: React.FC<BiographyContentProps> = ({ 
  content, 
  images, 
  className = '' 
}) => {

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Personal Information Section */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-heading font-bold text-primary-iron mb-6">
          {content.personalInfo.fullName}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-primary-steel">出生日期:</span>
                <p className="text-primary-iron">{content.personalInfo.birthDate}</p>
              </div>
              <div>
                <span className="font-medium text-primary-steel">逝世日期:</span>
                <p className="text-primary-iron">{content.personalInfo.deathDate}</p>
              </div>
              <div>
                <span className="font-medium text-primary-steel">出生地:</span>
                <p className="text-primary-iron">{content.personalInfo.birthPlace}</p>
              </div>
              <div>
                <span className="font-medium text-primary-steel">国籍:</span>
                <p className="text-primary-iron">{content.personalInfo.nationality}</p>
              </div>
            </div>
            
            {/* Family Information */}
            {content.personalInfo.family.length > 0 && (
              <div>
                <h4 className="font-medium text-primary-steel mb-2">家庭:</h4>
                <div className="space-y-1">
                  {content.personalInfo.family.map((member, index) => (
                    <p key={index} className="text-sm text-primary-iron">
                      <span className="font-medium">{member.name}</span> - {member.relationship}
                      {member.description && (
                        <span className="text-primary-steel ml-2">({member.description})</span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Portrait Image */}
          {images.length > 0 && (
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      {content.education.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-heading font-bold text-primary-iron mb-6">
            教育背景
          </h3>
          <div className="space-y-4">
            {content.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-accent-brass pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="font-semibold text-primary-iron">{edu.institution}</h4>
                  <span className="text-sm text-primary-steel">{edu.period}</span>
                </div>
                {edu.degree && (
                  <p className="text-sm font-medium text-accent-copper mb-1">{edu.degree}</p>
                )}
                <p className="text-sm text-primary-steel mb-1">{edu.location}</p>
                <p className="text-primary-iron">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Career Milestones Section */}
      {content.career.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-heading font-bold text-primary-iron mb-6">
            职业生涯
          </h3>
          <div className="space-y-6">
            {content.career.map((career, index) => (
              <div key={index} className="border-l-4 border-accent-copper pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="font-semibold text-primary-iron">{career.position}</h4>
                  <span className="text-sm text-primary-steel">{career.period}</span>
                </div>
                <p className="text-sm font-medium text-accent-copper mb-1">
                  {career.organization} - {career.location}
                </p>
                {career.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-primary-iron space-y-1 mt-2">
                    {career.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      {content.philosophy.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-heading font-bold text-primary-iron mb-6">
            设计理念
          </h3>
          <div className="space-y-6">
            {content.philosophy.map((phil, index) => (
              <div key={index} className="bg-neutral-light rounded-lg p-6">
                <h4 className="font-semibold text-primary-iron mb-3">{phil.theme}</h4>
                <blockquote className="text-primary-steel italic leading-relaxed mb-2">
                  &ldquo;{phil.content}&rdquo;
                </blockquote>
                {(phil.source || phil.year) && (
                  <cite className="text-sm text-primary-steel">
                    {phil.source && `— ${phil.source}`}
                    {phil.year && ` (${phil.year})`}
                  </cite>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Collaborations Section */}
      {content.collaborations.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-heading font-bold text-primary-iron mb-6">
            重要合作
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.collaborations.map((collab, index) => (
              <div key={index} className="border border-neutral-medium rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-primary-iron">{collab.collaborator}</h4>
                  <span className="text-sm text-primary-steel">{collab.period}</span>
                </div>
                <p className="text-sm font-medium text-accent-copper mb-2">{collab.project}</p>
                <p className="text-primary-steel text-sm mb-2">{collab.description}</p>
                {collab.outcome && (
                  <p className="text-sm text-primary-iron font-medium">
                    结果: {collab.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legacy Section */}
      {content.legacy.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-heading font-bold text-primary-iron mb-6">
            影响与遗产
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['influence', 'innovation', 'recognition', 'preservation'].map((category) => {
              const items = content.legacy.filter(item => item.category === category);
              if (items.length === 0) return null;
              
              const categoryNames = {
                influence: '影响力',
                innovation: '创新',
                recognition: '认可',
                preservation: '保护'
              };
              
              return (
                <div key={category} className="space-y-3">
                  <h4 className="font-semibold text-primary-iron text-center">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h4>
                  {items.map((item, index) => (
                    <div key={index} className="bg-neutral-light rounded-lg p-3">
                      <h5 className="font-medium text-primary-iron text-sm mb-1">
                        {item.title}
                        {item.year && <span className="text-primary-steel ml-1">({item.year})</span>}
                      </h5>
                      <p className="text-xs text-primary-steel">{item.description}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default BiographyContent;