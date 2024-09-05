import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FormCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ children, title }) => {
  return (
    <div className="flex w-full justify-center md:p-12">
      <Card className="md:border-1 w-full max-w-xl border-0 bg-background shadow-none md:bg-background-secondary md:shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
