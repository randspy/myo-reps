import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FormCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ children, title }) => {
  return (
    <div className="flex w-full justify-center p-4 md:p-12">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
