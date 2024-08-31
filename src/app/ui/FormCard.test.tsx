import { render, screen } from '@testing-library/react';
import { FormCard } from '@/app/ui/FormCard';

describe('Form card', () => {
  it('renders component with title and content', () => {
    render(
      <FormCard title="Form card">
        <div>Form card content</div>
      </FormCard>,
    );

    expect(screen.getByText('Form card')).toBeInTheDocument();
    expect(screen.getByText('Form card content')).toBeInTheDocument();
  });
});
