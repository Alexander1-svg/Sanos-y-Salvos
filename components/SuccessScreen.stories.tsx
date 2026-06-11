import type { Meta, StoryObj } from "@storybook/react";
import SuccessScreen from "./SuccessScreen";

const meta: Meta<typeof SuccessScreen> = {
  title: "Components/SuccessScreen",
  component: SuccessScreen,
};

export default meta;
type Story = StoryObj<typeof SuccessScreen>;

export const Default: Story = {
  args: {
    nombreMascota: "Luna",
    email: "ejemplo@correo.com",
    onReset: () => console.log("reset"),
  },
};