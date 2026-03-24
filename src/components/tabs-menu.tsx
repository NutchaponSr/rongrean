import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Props {
  triggers: Array<{
    value: string;
    label: string;
    content: React.ReactNode;
  }>;
  customMenu?: React.ReactNode;
}

export const TabsMenu = ({ triggers, customMenu }: Props) => {
  return (
    <Tabs>
      <TabsList variant="line">
        <div className="flex items-center justify-start">
          {triggers.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </div>

        {customMenu}
      </TabsList>
      {triggers.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};