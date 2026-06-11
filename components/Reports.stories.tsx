import type { Meta, StoryObj } from "@storybook/react";
import ReportForm from "./Reports";

const meta: Meta<typeof ReportForm> = {
  title: "Components/ReportForm",
  component: ReportForm,
};

export default meta;
type Story = StoryObj<typeof ReportForm>;

export const Default: Story = {
  args: {
    onSubmitted: (nombreMascota, email) => 
      console.log("Enviado:", nombreMascota, email),
  },
};