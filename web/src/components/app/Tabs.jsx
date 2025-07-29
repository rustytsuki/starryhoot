import { useState, useEffect, useRef } from 'react';
import { Tabs as ShadcnTabs, TabsList, TabsTrigger } from '../../shadcn/components/ui/tabs.tsx';
import styles from './Tabs.module.scss';

export function Tabs() {
    const HOME_VALUE = 'Home';

    const [tabs_, set_tabs] = useState([{ value: HOME_VALUE }]);
    const [actived_value_, set_actived_value] = useState(HOME_VALUE);

    const effectRun = useRef(false);
    const tabsRef = useRef(tabs_);

    useEffect(() => {
        tabsRef.current = tabs_;
    }, [tabs_]);

    useEffect(() => {
        if (!effectRun.current) {
            console.log('---------------------register tab event-----------------------');
            starryhoot.on_add_tab((index, title) => {
                console.log(`on_add_tab: ${index}, ${title}`);
                if (index > 0 && index <= tabsRef.current.length) {
                    const newTab = { value: title };
                    const updatedTabs = [...tabsRef.current];
                    updatedTabs.splice(index, 0, newTab);
                    set_tabs(updatedTabs);
                }
            });
            starryhoot.on_remove_tab((index) => {
                console.log(`on_remove_tab: ${index}`);
                if (index > 0 && index < tabsRef.current.length) {
                    const updatedTabs = [...tabsRef.current];
                    updatedTabs.splice(index, 1);
                    set_tabs(updatedTabs);
                }
            });
            starryhoot.on_active_tab((index) => {
                console.log(`on_active_tab: ${index}`);
                if (!tabsRef.current[index]) {
                    return;
                }
                set_actived_value(tabsRef.current[index].value);
            });

            effectRun.current = true;
        }

        return () => {
            // need unregister starryhoot callback?
        };
    }, []);

    const removeTab = (index) => {
        if (0 == index) {
            return;
        }
        const actived_index = tabs_.findIndex((t) => t.value === actived_value_);
        const updatedTabs = tabs_.filter((_, i) => i !== index);
        set_tabs(updatedTabs);

        if (1 == updatedTabs.length) {
            selectTab(0);
        } else if (actived_index === index) {
            selectTab(index > 0 ? index - 1 : 0);
        }

        starryhoot.close_tab(index);
    };

    const selectTab = (index) => {
        if (!tabs_[index]) {
            return;
        }
        const value = tabs_[index].value;
        if (value === actived_value_) {
            return;
        }

        set_actived_value(value);
        starryhoot.set_active_tab(index);
    };

    const selectByValue = (value) => {
        const index = tabs_.findIndex((t) => t.value === value);
        if (index < 0) {
            return;
        }
        selectTab(index);
    };

    return (
        <div className={styles.root}>
            <ShadcnTabs value={actived_value_} activationMode="manual" className="max-w-xs w-full" onValueChange={selectByValue}>
                <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none gap-1">
                    {tabs_.map((tab, index) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
                        >
                            <code className="text-[13px]">{tab.value} </code>{' '}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTab(index);
                                }}
                            >
                                x
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </ShadcnTabs>
        </div>
    );
}
