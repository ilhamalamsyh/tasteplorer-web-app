/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import Image from 'next/image';

export interface Instruction {
  id: string;
  stepNumber: number;
  title?: string;
  description: string;
  duration?: string;
  temperature?: string;
  imageUrl?: string;
  tips?: string[];
}

interface InstructionsListProps {
  instructions: Instruction[];
  title?: string;
  className?: string;
}

const InstructionsList: React.FC<InstructionsListProps> = ({
  instructions,
  title = 'Instructions',
  className = '',
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(stepId)) {
        newCompleted.delete(stepId);
      } else {
        newCompleted.add(stepId);
      }
      return newCompleted;
    });
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  const completedCount = completedSteps.size;
  const totalCount = instructions.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <section
      style={{ borderRadius: 20, overflow: 'hidden' }}
      className={`bg-white dark:bg-background-dark p-6 md:p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount}/{totalCount} steps
          </span>
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Instructions List */}
      <ol className="space-y-6 list-none p-0 m-0">
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(instruction.id);
          const isExpanded = expandedStep === instruction.id;
          const isLast = index === instructions.length - 1;

          return (
            <li
              key={instruction.id}
              className="relative transition-all duration-300"
            >
              {/* Connection Line */}
              {!isLast && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -z-10" />
              )}

              <div className="flex gap-4 md:gap-6">
                {/* Step Number Badge - clickable, animated, and visually inviting */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleStepComplete(instruction.id)}
                    className={`group relative focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform active:scale-95 ${
                      isCompleted ? 'ring-2 ring-primary' : ''
                    }`}
                    aria-label={`Mark step ${instruction.stepNumber} as ${
                      isCompleted ? 'incomplete' : 'complete'
                    }`}
                    type="button"
                  >
                    <span
                      className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-bold text-lg shadow transition-all duration-200 cursor-pointer select-none
                        ${
                          isCompleted
                            ? 'bg-primary border-primary text-white scale-105'
                            : 'bg-white dark:bg-background-dark border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 group-hover:border-primary group-hover:text-primary hover:scale-105'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        instruction.stepNumber
                      )}
                    </span>
                  </button>
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6">
                    {/* Step Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {instruction.title && (
                          <h3
                            className={`text-lg md:text-xl font-semibold mb-2 transition-all duration-200 ${
                              isCompleted
                                ? 'text-gray-500 dark:text-gray-400 line-through'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {instruction.title}
                          </h3>
                        )}

                        {/* Meta Info */}
                        {(instruction.duration || instruction.temperature) && (
                          <div className="flex flex-wrap gap-3 mb-3">
                            {instruction.duration && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {instruction.duration}
                              </span>
                            )}
                            {instruction.temperature && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm font-medium">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                                  />
                                </svg>
                                {instruction.temperature}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expand Button */}
                      {(instruction.imageUrl || instruction.tips) && (
                        <button
                          onClick={() => toggleStepExpansion(instruction.id)}
                          className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          aria-label={`${
                            isExpanded ? 'Collapse' : 'Expand'
                          } step details`}
                        >
                          <svg
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Step Description */}
                    <p
                      className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-all duration-200 ${
                        isCompleted ? 'line-through opacity-75' : ''
                      }`}
                    >
                      {instruction.description}
                    </p>

                    {/* Expandable Content */}
                    {isExpanded &&
                      (instruction.imageUrl || instruction.tips) && (
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {/* Step Image */}
                          {instruction.imageUrl && (
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <Image
                                src={instruction.imageUrl}
                                alt={`Step ${instruction.stepNumber} illustration`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 600px"
                              />
                            </div>
                          )}

                          {/* Tips */}
                          {instruction.tips && instruction.tips.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                              <h4 className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-300 mb-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                  />
                                </svg>
                                Pro Tips
                              </h4>
                              <ul className="space-y-1">
                                {instruction.tips.map((tip, tipIndex) => (
                                  <li
                                    key={tipIndex}
                                    className="text-sm text-blue-800 dark:text-blue-300"
                                  >
                                    • {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Completion Actions */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
              Recipe Complete!
            </h3>
          </div>
          <p className="text-green-700 dark:text-green-400 mb-4">
            Congratulations! You've finished cooking this recipe.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50">
            Rate this recipe
          </button>
        </div>
      )}
    </section>
  );
};

export default InstructionsList;
