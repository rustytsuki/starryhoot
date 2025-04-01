import { useState, useEffect, useRef } from 'react';
import BSTab from 'react-bootstrap/Tab';
import BSTabs from 'react-bootstrap/Tabs';
import CloseButton from 'react-bootstrap/CloseButton';
import styles from './Tabs.module.scss';

export function Tabs() {
    const [tabs_, set_tabs] = useState([{ title: 'Home' }]);
    const [actived_index_, set_actived_index] = useState(0);
    const [unlisten_, set_unlisten] = useState(null);

    const effectRun = useRef(false);
    const tabsRef = useRef(tabs_);

    useEffect(() => {
        tabsRef.current = tabs_;
    }, [tabs_]);

    useEffect(() => {
        if (!effectRun.current) {
            console.log('---------------------register tab event-----------------------');
            starryhoot.on_add_tab((index, title) => {
                if (index > 0 && index <= tabsRef.current.length) {
                    const newTab = { title: title };
                    const updatedTabs = [...tabsRef.current];
                    updatedTabs.splice(index, 0, newTab);
                    set_tabs(updatedTabs);
                    
                }
            });
            starryhoot.on_active_tab(index => {
                set_actived_index(index);
            });

            effectRun.current = true;
        }

        return () => {
            // if (unlisten_) {
            //     unlisten_();
            // }
        };
    }, []);

    const removeTab = (index) => {
        if (0 == index) {
            return;
        }
        const updatedTabs = tabs_.filter((_, i) => i !== index);
        set_tabs(updatedTabs);

        if (1 == updatedTabs.length) {
            selectTab(0);
        } else if (actived_index_ === index) {
            selectTab(index > 0 ? index - 1 : 0);
        } else if (actived_index_ > index) {
            selectTab(actived_index_ - 1);
        }

        starryhoot.close_tab(index);
    };

    const selectTab = (index) => {
        if (index == actived_index_) {
            return;
        }

        set_actived_index(index);
        starryhoot.set_active_tab(index);
    };

    return (
        <div className={styles.root}>
            <BSTabs
                activeKey={actived_index_}
                transition={false}
                id="noanim-tab-example"
                onSelect={(k) => selectTab(Number(k))}
            >
                {tabs_.map((item, index) => (
                    <BSTab
                        key={index}
                        eventKey={index}
                        title={
                            <span className={styles[`${index === 0 ? 'first-tab' : 'other-tab'}`]}>
                                {item.title}
                                {index !== 0 && (
                                    <CloseButton
                                        className={styles['close-btn']}
                                        style={{ fontSize: '0.5rem', width: '16px', height: '16px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTab(index);
                                        }}
                                    />
                                )}
                            </span>
                        }
                    ></BSTab>
                ))}
            </BSTabs>
        </div>
    );
}
