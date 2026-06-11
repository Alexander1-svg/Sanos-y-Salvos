import type { Meta, StoryObj } from "@storybook/react";
import Coincidencias from "./Coincidencias";

const meta: Meta<typeof Coincidencias> = {
  title: "Components/Coincidencias",
  component: Coincidencias,
};

export default meta;
type Story = StoryObj<typeof Coincidencias>;

export const Default: Story = {
  args: {
    reporteId: "mock-reporte-123",
    nombreMascota: "Luna",
  },
};

export const SinReporteId: Story = {
  args: {
    reporteId: "",
    nombreMascota: "Luna",
  },
};