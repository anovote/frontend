import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import StandardLayout from 'components/layout/Standard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import chrisPicture from 'style/assets/christoffer.jpg'
import emilPicture from 'style/assets/emil.jpg'
import { ReactComponent as PurpleLine } from 'style/assets/purple-line.svg'
import sanderPicture from 'style/assets/sander.jpg'
import steffenPicture from 'style/assets/steffen.jpg'

export default function About(): ReactElement {
    const [t] = useTranslation(['site'])
    const team = [
        {
            name: 'Steffen Holanger',
            img: steffenPicture,
            username: 'spiftire',
        },

        {
            name: 'Emil Elton Nilsen',
            img: emilPicture,
            username: 'perkynades',
        },

        {
            name: 'Sander Hurlen',
            img: sanderPicture,
            username: 'sanderhurlen',
        },
        {
            name: 'Christoffer Andersen Træen',
            img: chrisPicture,
            username: 'freshfish70',
        },
    ]

    return (
        <StandardLayout wrapperClassName="about" contentClassName="about-layout-content-header">
            <div className="about-hero">
                <div className="site-layout-content">
                    <Title level={1} id="about-title">
                        {t('site:About us')}
                    </Title>
                </div>
                <PurpleLine id="purple-line" />
            </div>

            <div className="about-content">
                <div className="site-layout-content">
                    <Title level={1}>{t('site:The team')}</Title>
                    <div className="team-carousel">
                        {team.map((member, index) => {
                            return (
                                <span className="team-member" key={index}>
                                    <img
                                        src={member.img}
                                        className="member-image"
                                        alt={`Picture of ${member.name}`}
                                    ></img>

                                    <Title level={4}>{member.name}</Title>
                                    <a href={`http://github.com/${member.username}`}>{`@${member.username}`}</a>
                                </span>
                            )
                        })}
                    </div>
                    <section>
                        <Title level={1} id="how-it-started">
                            {t('site:How it all started')}
                        </Title>
                        <Text>
                            One day the Hare laughed at the short feet and slow speed of the Tortoise. The Tortoise
                            replied: You may be as fast as the wind, but I will beat you in a race! The Hare thought
                            this idea was impossible and he agreed to the proposal. It was agreed that the Fox should
                            choose the course and decide the end. The day for the race came, and the Tortoise and Hare
                            started together. <br />
                            The Tortoise never stopped for a moment, walking slowly but steadily, right to the end of
                            the course. The Hare ran fast and stopped to lie down for a rest. But he fell fast asleep.
                            Eventually, he woke up and ran as fast as he could. But when he reached the end, he saw the
                            Tortoise there already, sleeping comfortably after her effort.
                        </Text>
                    </section>
                </div>
            </div>
        </StandardLayout>
    )
}
