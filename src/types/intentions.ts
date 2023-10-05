const AVIARY_INTENTIONS = {
  primary: "primary",
  system: "system",
  danger: "danger",
  success: "success",
  textSuccess: "textSuccess",
  textSystem: "textSystem",
  textDanger: "textDanger",
  lightFilled: "lightFilled",
  lightOutlined: "lightOutlined",
  lightText: "lightText",
};

type AviaryIntentions = keyof typeof AVIARY_INTENTIONS;

export type { AviaryIntentions };
export { AVIARY_INTENTIONS };
