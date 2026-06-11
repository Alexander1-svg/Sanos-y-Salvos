import type { Meta, StoryObj } from "@storybook/react";
import MapaPerdida from "./MapaPerdida";

const meta: Meta<typeof MapaPerdida> = {
  title: "Components/MapaPerdida",
  component: MapaPerdida,
};

export default meta;
type Story = StoryObj<typeof MapaPerdida>;

export const Default: Story = {
  args: {
    onUbicacionSeleccionada: (coords, direccion) =>
      console.log("Ubicación:", coords, direccion),
  },
};