import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../../../shadcn/components/ui/tabs.tsx';

export function SheetsTabs({ editor }) {
    const [cur_sheet_index_, set_cur_sheet_index_] = useState(0);
    const [sheets_, set_sheets] = useState([]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        let sheets = [];
        const sheets_count = editor.xlsx_get_sheets_count();
        for (let i = 0; i < sheets_count; ++i) {
            const sheet_name = editor.xlsx_get_sheet_name(i);
            sheets.push({
                value: i,
                name: sheet_name,
            });
        }

        set_sheets(sheets);

        return () => {};
    }, [editor]);

    const selectTab = (value) => {
        // console.log('select sheet: ', value);
        editor.xlsx_select_sheet(value);
        set_cur_sheet_index_(value);
    };

    return (
        editor &&
        sheets_.length > 0 && (
            <Tabs
                value={cur_sheet_index_}
                defaultValue={sheets_[0].value}
                className="ml-5 max-w-xs w-full"
                onValueChange={selectTab}
            >
                <TabsList>
                    {sheets_.map((sheet) => (
                        <TabsTrigger key={sheet.value} value={sheet.value}>
                            <span className="text-[12px]">{sheet.name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        )
    );
}
