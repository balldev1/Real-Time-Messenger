'use client';

import ReactSelect from "react-select";

interface SelectProps {
    label: string;
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, disabled }) => {
    return (
        <div className="z-[100]">
            <label className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                {/* / react-select / */}
                <ReactSelect
                    isDisabled={disabled}
                    value={value}
                    onChange={onChange}
                    isMulti // ใช้กำหนดว่า React Select สามารถเลือกหลายตัวเ
                    options={options} // ตัวเลือก
                    menuPortalTarget={document.body} // document.body คือ property ที่อ้างถึง DOM element ที่แทน <body> tag ใน HTML ของหน้าเว็บ.
                    styles={{
                        menuPortal: (base) => ({
                            ...base, //เอาค่า base ทั้งหมดมาใช้ z9999 ให้อยู่หน้าสุด
                            zIndex: 9999
                        }),
                    }}
                    classNames={{
                        control: () => 'text-sm' // controlคือส่วนที่แสดงผล dropdown textsm ขนาดข้อความ sm
                    }}
                />
            </div>
        </div>
    )
}

export default Select