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

        const updatedTabs = tabs_.filter((_, i) => i !== index);
        set_tabs(updatedTabs);

        starryhoot.close_tab(index);
    };

    const selectTab = (value) => {
        if (value === actived_value_) {
            return;
        }
        set_actived_value(value);
        const index = tabsRef.current.findIndex((t) => t.value === value);
        if (index >= 0) {
            starryhoot.set_active_tab(index);
        }
    };

    return (
        <div className={styles.root}>
            <ShadcnTabs
                value={actived_value_}
                activationMode="manual"
                className="max-w-xs w-full"
                onValueChange={selectTab}
            >
                <TabsList className="p-0 h-auto bg-background gap-1">
                    {tabs_.map((tab, index) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
                        >
                            <code className="text-[13px]">
                                {tab.value}{' '}
                                {index !== 0 && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTab(index);
                                        }}
                                    >
                                        x
                                    </span>
                                )}
                            </code>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </ShadcnTabs>
        </div>
    );
}
