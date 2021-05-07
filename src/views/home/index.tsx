import { ArrowRightOutlined, FileTextTwoTone, PieChartTwoTone, ScheduleTwoTone } from '@ant-design/icons'
import { Space } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import StandardLayout from 'components/layout/Standard'
import { getPublicRoute } from 'core/routes/siteRoutes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Typist from 'react-typist'
import { ReactComponent as Lines } from 'style/assets/lines.svg'
import { ReactComponent as LockIcon } from 'style/assets/lock-with-effect.svg'
import showCase from 'style/assets/showcase@2x.png'

/**
 * Landing page of application and home root
 * @returns the landing page view
 */
export default function Home(): React.ReactElement {
    const { about, register } = getPublicRoute()
    const [t] = useTranslation(['site', 'navigation'])

    const howAnovoteWorksData = [
        {
            icon: <FileTextTwoTone twoToneColor="#edbf5b" />,
            title: t('site:Create'),
            text: t('site:Create paragraph'),
        },
        {
            icon: <ScheduleTwoTone twoToneColor="#758BFD" />,
            title: t('site:Organize'),
            text: t('site:Organize paragraph'),
        },
        {
            icon: <PieChartTwoTone twoToneColor="#00EBB1" />,
            title: t('site:Get Results'),
            text: t('site:Results paragraph'),
        },
    ]

    return (
        <StandardLayout>
            <section className="hero">
                <span className="title-with-action">
                    <Title level={1} className="title-box">
                        {t('site:Time to elect new board')}
                        <Typist cursor={{ blink: true, hideWhenDone: true, hideWhenDoneDelay: 1000 }}>
                            {t('site:a new board')}
                            <Typist.Delay ms={2000} />
                            <Typist.Backspace count={12} delay={1000} />
                            <Typist.Delay ms={2000} />
                            {t('site:a new leader')}
                            <Typist.Delay ms={2000} />
                            <Typist.Backspace count={13} delay={2000} />
                            <Typist.Delay ms={1000} />
                            {t('site:an new ambassador')}
                        </Typist>
                    </Title>
                    <Link to={register} id="organize-election">
                        <ArrowRightOutlined className="right-arrow" />
                        {t('site:Organize your first election')}
                    </Link>
                </span>
                <span className="showcase">
                    <img src={showCase} alt={t('site:Showcase of the elections view panel')} />
                    <Lines id="lines-background-effect" />
                </span>
            </section>

            <div className="content">
                <section id="how-anovote-works">
                    <Title level={1}>{t('site:How Anovote works')}</Title>
                    <Space wrap={true} className="principles">
                        {howAnovoteWorksData.map((data, index) => {
                            return (
                                <article key={index}>
                                    <span className="principle-icon">{data.icon}</span>
                                    <span className="principle-text">
                                        <Title level={3}>{data.title}</Title>
                                        <Text>{data.text}</Text>
                                    </span>
                                </article>
                            )
                        })}
                    </Space>
                </section>
                <section id="anovote-backstory">
                    <Title level={1}>{t('site:Anovote anonymous voting')}</Title>
                    <Space wrap={true} align="center" className="backstory-content">
                        <article className="backstory">
                            <Text>{t('site:Anovote was developed')}.</Text>
                            <br />
                            <Text>{t('site:All packed in to an simple')}!</Text>
                        </article>
                        <span className="article-image">
                            <LockIcon />
                        </span>
                    </Space>
                </section>
                <section id="about">
                    <Title level={1}>{t('site:About Anovote')}</Title>
                    <article>
                        <Text>{t('site:the idea of anovote')}.</Text>
                        <Link to={about} id="organize-election">
                            <ArrowRightOutlined className="right-arrow" />
                            {t('navigation:Read more')}
                        </Link>
                    </article>
                </section>
            </div>
        </StandardLayout>
    )
}
