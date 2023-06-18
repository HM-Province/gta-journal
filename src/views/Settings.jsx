import { mdiContentSave } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "primereact/button";
import React from "react";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";

export default function Settings() {
  return (
    <>
      <div className="p-4 surface-card border-round-xl flex flex-column w-12 mt-2 shadow-3">
        <h2 className="mt-0 mb-4">Основные настройки </h2>
        <div className="flex flex-column">
          <label htmlFor="expiry" className="font-bold block mb-2">
            Частота проверок статуса МТА
          </label>
          <InputNumber
            value={10}
            disabled
            prefix="Раз в "
            suffix=" сек."
            className="w-5 mb-1"
            min={1}
            max={30}
          />
          <span>Как часто нужно проверять, запущена ли МТА. Больше частота - больше нагрузка.</span>
        </div>
      </div>
      <div className="p-4 surface-card border-round-xl flex flex-column w-12 mt-2 shadow-3">
        <h2 className="mt-0 mb-4">Звук</h2>
        <div className="flex align-items-center">
          <InputSwitch disabled checked className="mr-2" />
          <span className="font-bold text-md">Звуки при клике</span>
        </div>
        <div className="flex align-items-center mt-2">
          <InputSwitch disabled checked className="mr-2" />
          <span className="font-bold text-md">Звуки уведомлений</span>
        </div>
      </div>
      <div className="p-4 surface-card border-round-xl flex flex-column w-12 mt-2 shadow-3">
        <Button
          label="Сохранить изменения"
          disabled
          severity={"success"}
          icon={<Icon size={1} path={mdiContentSave} />}
          className="py-2 w-12"
        />
      </div>
    </>
  );
}
