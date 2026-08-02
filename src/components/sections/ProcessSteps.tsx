type ProcessStepsProps = {
  steps: { title: string; description: string }[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="card-surface p-4"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
            {index + 1}
          </span>
          <p className="mt-3 font-semibold">{step.title}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
